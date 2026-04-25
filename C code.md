
### 1. Introduction to OS (Process Creation via Fork)
A basic program demonstrating system calls to create a process.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>

int main() {
    pid_t pid = fork();
    if (pid < 0) {
        printf("Fork failed!\n");
    } else if (pid == 0) {
        printf("Child Process: PID = %d\n", getpid());
    } else {
        printf("Parent Process: PID = %d, Child PID = %d\n", getpid(), pid);
    }
    return 0;
}
```

---

### 2. CPU Scheduling: FCFS (First Come First Serve)
```c
#include <stdio.h>

int main() {
    int bt[10] = {5, 8, 12}, wt[10], tat[10], n = 3;
    float total_wt = 0, total_tat = 0;
    
    wt[0] = 0; // First process has 0 waiting time
    tat[0] = bt[0];
    
    for (int i = 1; i < n; i++) {
        wt[i] = wt[i-1] + bt[i-1];
        tat[i] = wt[i] + bt[i];
    }
    
    printf("Process\tBurst\tWait\tTurnaround\n");
    for (int i = 0; i < n; i++) {
        total_wt += wt[i];
        total_tat += tat[i];
        printf("P%d\t%d\t%d\t%d\n", i+1, bt[i], wt[i], tat[i]);
    }
    printf("Avg Wait: %.2f, Avg TAT: %.2f\n", total_wt/n, total_tat/n);
    return 0;
}
```

---

### 3. CPU Scheduling: SJF (Non-Preemptive)
```c
#include <stdio.h>

int main() {
    int bt[5] = {6, 2, 8, 3, 4}, p[5] = {1, 2, 3, 4, 5}, n = 5;
    int wt[5], tat[5], temp;
    float total_wt = 0, total_tat = 0;

    // Sort by Burst Time
    for (int i = 0; i < n-1; i++) {
        for (int j = i+1; j < n; j++) {
            if (bt[i] > bt[j]) {
                temp = bt[i]; bt[i] = bt[j]; bt[j] = temp;
                temp = p[i]; p[i] = p[j]; p[j] = temp;
            }
        }
    }
    
    wt[0] = 0;
    for (int i = 1; i < n; i++) {
        wt[i] = wt[i-1] + bt[i-1];
    }
    
    for (int i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
        total_wt += wt[i];
        total_tat += tat[i];
        printf("P%d\t%d\t%d\t%d\n", p[i], bt[i], wt[i], tat[i]);
    }
    printf("Avg Wait: %.2f, Avg TAT: %.2f\n", total_wt/n, total_tat/n);
    return 0;
}
```

---

### 4. Priority Scheduling
```c
#include <stdio.h>

int main() {
    int bt[5] = {10, 1, 2, 1, 5}, pr[5] = {3, 1, 4, 5, 2}, p[5] = {1, 2, 3, 4, 5}, n = 5;
    int wt[5], tat[5], temp;
    
    // Sort by Priority (Lower number = Higher Priority)
    for (int i = 0; i < n-1; i++) {
        for (int j = i+1; j < n; j++) {
            if (pr[i] > pr[j]) {
                temp = pr[i]; pr[i] = pr[j]; pr[j] = temp;
                temp = bt[i]; bt[i] = bt[j]; bt[j] = temp;
                temp = p[i]; p[i] = p[j]; p[j] = temp;
            }
        }
    }
    
    wt[0] = 0;
    for (int i = 1; i < n; i++) {
        wt[i] = wt[i-1] + bt[i-1];
    }
    
    for (int i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
        printf("P%d\tPri:%d\tWait:%d\tTAT:%d\n", p[i], pr[i], wt[i], tat[i]);
    }
    return 0;
}
```

---

### 5. CPU Scheduling: Round Robin
```c
#include <stdio.h>

int main() {
    int bt[3] = {10, 5, 8}, rem_bt[3], wt[3], tat[3], n = 3, qt = 2;
    int t = 0, done;
    
    for (int i = 0; i < n; i++) rem_bt[i] = bt[i];
    
    while (1) {
        done = 1;
        for (int i = 0; i < n; i++) {
            if (rem_bt[i] > 0) {
                done = 0;
                if (rem_bt[i] > qt) {
                    t += qt;
                    rem_bt[i] -= qt;
                } else {
                    t += rem_bt[i];
                    wt[i] = t - bt[i];
                    rem_bt[i] = 0;
                }
            }
        }
        if (done == 1) break;
    }
    
    for (int i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
        printf("P%d\tWait:%d\tTAT:%d\n", i+1, wt[i], tat[i]);
    }
    return 0;
}
```

---

### 6. CPU Scheduling: HRRN (Highest Response Ratio Next)
```c
#include <stdio.h>

int main() {
    int at[5] = {0, 2, 4, 6, 8}, bt[5] = {3, 6, 4, 5, 2}, n = 5;
    int completed[5] = {0}, time = 0, done = 0;
    float wt, tat, hrr, temp;
    int loc;

    printf("Process\tWait\tTAT\n");
    while(done < n) {
        hrr = -1;
        loc = -1;
        for(int i = 0; i < n; i++) {
            if(at[i] <= time && completed[i] == 0) {
                temp = (float)((time - at[i]) + bt[i]) / bt[i]; // Response Ratio
                if(hrr < temp) {
                    hrr = temp;
                    loc = i;
                }
            }
        }
        if(loc != -1) {
            wt = time - at[loc];
            time += bt[loc];
            tat = time - at[loc];
            completed[loc] = 1;
            done++;
            printf("P%d\t%.0f\t%.0f\n", loc+1, wt, tat);
        } else {
            time++;
        }
    }
    return 0;
}
```

---

### 7 & 15. Banker's Algorithm (Deadlock Avoidance)
```c
#include <stdio.h>

int main() {
    int n = 5, m = 3;
    int alloc[5][3] = { {0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2} };
    int max[5][3] = { {7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3} };
    int avail[3] = {3, 3, 2};
    int f[5] = {0}, ans[5], ind = 0;
    int need[5][3];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) need[i][j] = max[i][j] - alloc[i][j];
    }

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            if (f[i] == 0) {
                int flag = 0;
                for (int j = 0; j < m; j++) {
                    if (need[i][j] > avail[j]) { flag = 1; break; }
                }
                if (flag == 0) {
                    ans[ind++] = i;
                    for (int y = 0; y < m; y++) avail[y] += alloc[i][y];
                    f[i] = 1;
                }
            }
        }
    }

    printf("Safe Sequence is: \n");
    for (int i = 0; i < n - 1; i++) printf(" P%d ->", ans[i]);
    printf(" P%d\n", ans[n - 1]);
    return 0;
}
```

---

### 8. Page Replacement: LRU
```c
#include <stdio.h>

int main() {
    int pages[] = {7, 0, 1, 2, 0, 3, 0, 4}, n = 8, frames = 3;
    int f[3] = {-1, -1, -1}, time[3] = {0}, faults = 0, counter = 0;

    for(int i = 0; i < n; i++) {
        int flag1 = 0, flag2 = 0, min, pos = 0;
        counter++;
        for(int j = 0; j < frames; j++) {
            if(f[j] == pages[i]) { time[j] = counter; flag1 = flag2 = 1; break; }
        }
        if(flag1 == 0) {
            for(int j = 0; j < frames; j++) {
                if(f[j] == -1) { f[j] = pages[i]; time[j] = counter; faults++; flag2 = 1; break; }
            }
        }
        if(flag2 == 0) {
            min = time[0];
            for(int j = 1; j < frames; j++) {
                if(time[j] < min) { min = time[j]; pos = j; }
            }
            f[pos] = pages[i];
            time[pos] = counter;
            faults++;
        }
    }
    printf("Total LRU Page Faults: %d\n", faults);
    return 0;
}
```

---

### 9. Page Replacement: FIFO
```c
#include <stdio.h>

int main() {
    int pages[] = {1, 3, 0, 3, 5, 6, 3}, n = 7, frames = 3;
    int f[3] = {-1, -1, -1}, faults = 0, pointer = 0;

    for (int i = 0; i < n; i++) {
        int flag = 0;
        for (int j = 0; j < frames; j++) {
            if (f[j] == pages[i]) { flag = 1; break; }
        }
        if (flag == 0) {
            f[pointer] = pages[i];
            pointer = (pointer + 1) % frames;
            faults++;
        }
    }
    printf("Total FIFO Page Faults: %d\n", faults);
    return 0;
}
```

---

### 10. Page Replacement: Optimal
```c
#include <stdio.h>

int main() {
    int pages[] = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2}, n = 13, frames = 4;
    int f[4] = {-1, -1, -1, -1}, faults = 0;

    for (int i = 0; i < n; i++) {
        int flag1 = 0, flag2 = 0;
        for (int j = 0; j < frames; j++) {
            if (f[j] == pages[i]) { flag1 = flag2 = 1; break; }
        }
        if (flag1 == 0) {
            for (int j = 0; j < frames; j++) {
                if (f[j] == -1) { f[j] = pages[i]; flag2 = 1; faults++; break; }
            }
        }
        if (flag2 == 0) {
            int pos = -1, farthest = i;
            for (int j = 0; j < frames; j++) {
                int k;
                for (k = i + 1; k < n; k++) {
                    if (f[j] == pages[k]) {
                        if (k > farthest) { farthest = k; pos = j; }
                        break;
                    }
                }
                if (k == n) { pos = j; break; }
            }
            f[pos] = pages[i];
            faults++;
        }
    }
    printf("Total Optimal Page Faults: %d\n", faults);
    return 0;
}
```

---

### 11. Memory Management: First Fit
```c
#include <stdio.h>

int main() {
    int blockSize[] = {100, 500, 200, 300, 600};
    int processSize[] = {212, 417, 112, 426};
    int m = 5, n = 4, allocation[4];

    for (int i = 0; i < n; i++) allocation[i] = -1;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (blockSize[j] >= processSize[i]) {
                allocation[i] = j;
                blockSize[j] -= processSize[i];
                break;
            }
        }
    }
    
    printf("Process\tSize\tBlock\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t", i+1, processSize[i]);
        if (allocation[i] != -1) printf("%d\n", allocation[i] + 1);
        else printf("Not Allocated\n");
    }
    return 0;
}
```

---

### 12. Memory Management: Best Fit
```c
#include <stdio.h>

int main() {
    int blockSize[] = {100, 500, 200, 300, 600};
    int processSize[] = {212, 417, 112, 426};
    int m = 5, n = 4, allocation[4];

    for (int i = 0; i < n; i++) allocation[i] = -1;

    for (int i = 0; i < n; i++) {
        int bestIdx = -1;
        for (int j = 0; j < m; j++) {
            if (blockSize[j] >= processSize[i]) {
                if (bestIdx == -1 || blockSize[j] < blockSize[bestIdx]) {
                    bestIdx = j;
                }
            }
        }
        if (bestIdx != -1) {
            allocation[i] = bestIdx;
            blockSize[bestIdx] -= processSize[i];
        }
    }

    printf("Process\tSize\tBlock\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t", i+1, processSize[i]);
        if (allocation[i] != -1) printf("%d\n", allocation[i] + 1);
        else printf("Not Allocated\n");
    }
    return 0;
}
```

---

### 13. Memory Management: Worst Fit
```c
#include <stdio.h>

int main() {
    int blockSize[] = {100, 500, 200, 300, 600};
    int processSize[] = {212, 417, 112, 426};
    int m = 5, n = 4, allocation[4];

    for (int i = 0; i < n; i++) allocation[i] = -1;

    for (int i = 0; i < n; i++) {
        int worstIdx = -1;
        for (int j = 0; j < m; j++) {
            if (blockSize[j] >= processSize[i]) {
                if (worstIdx == -1 || blockSize[j] > blockSize[worstIdx]) {
                    worstIdx = j;
                }
            }
        }
        if (worstIdx != -1) {
            allocation[i] = worstIdx;
            blockSize[worstIdx] -= processSize[i];
        }
    }

    printf("Process\tSize\tBlock\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t", i+1, processSize[i]);
        if (allocation[i] != -1) printf("%d\n", allocation[i] + 1);
        else printf("Not Allocated\n");
    }
    return 0;
}
```

---

### 14. Reader-Writer Problem using Semaphores
```c
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

sem_t wrt;
pthread_mutex_t mutex;
int read_count = 0, shared_data = 1;

void *writer(void *wno) {   
    sem_wait(&wrt);
    shared_data *= 2;
    printf("Writer %d modified data to %d\n", (*((int *)wno)), shared_data);
    sem_post(&wrt);
    return NULL;
}

void *reader(void *rno) {   
    pthread_mutex_lock(&mutex);
    read_count++;
    if (read_count == 1) sem_wait(&wrt);
    pthread_mutex_unlock(&mutex);

    printf("Reader %d reads data as %d\n", *((int *)rno), shared_data);

    pthread_mutex_lock(&mutex);
    read_count--;
    if (read_count == 0) sem_post(&wrt);
    pthread_mutex_unlock(&mutex);
    return NULL;
}

int main() {
    pthread_t r[2], w[2];
    pthread_mutex_init(&mutex, NULL);
    sem_init(&wrt, 0, 1);
    int ids[2] = {1, 2};

    pthread_create(&r[0], NULL, reader, (void *)&ids[0]);
    pthread_create(&w[0], NULL, writer, (void *)&ids[0]);
    pthread_create(&r[1], NULL, reader, (void *)&ids[1]);
    pthread_create(&w[1], NULL, writer, (void *)&ids[1]);

    pthread_join(r[0], NULL);
    pthread_join(w[0], NULL);
    pthread_join(r[1], NULL);
    pthread_join(w[1], NULL);

    pthread_mutex_destroy(&mutex);
    sem_destroy(&wrt);
    return 0;
}
```