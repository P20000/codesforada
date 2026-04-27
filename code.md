### 1. Introduction to OS (Process Creation via Fork)
```python
import os

def simulate_fork():
    pid = os.fork()

    if pid < 0:
        print("Fork failed!")
    elif pid == 0:
        print(f"Child Process: PID = {os.getpid()}")
        os._exit(0)
    else:
        print(f"Parent Process: PID = {os.getpid()}, Child PID = {pid}")
        os.wait()

simulate_fork()
```

---

### 2. CPU Scheduling: FCFS (First Come First Serve)
```python
def fcfs(burst_times):
    n = len(burst_times)
    wt = [0] * n
    tat = [0] * n

    tat[0] = burst_times[0]
    for i in range(1, n):
        wt[i] = wt[i - 1] + burst_times[i - 1]
        tat[i] = wt[i] + burst_times[i]

    print("Process\tBurst\tWait\tTurnaround")
    for i in range(n):
        print(f"P{i+1}\t{burst_times[i]}\t{wt[i]}\t{tat[i]}")

    print(f"Avg Wait: {sum(wt)/n:.2f}, Avg TAT: {sum(tat)/n:.2f}")

fcfs([5, 8, 12])
```

---

### 3. CPU Scheduling: SJF (Non-Preemptive)
```python
def sjf(burst_times):
    n = len(burst_times)
    processes = sorted(enumerate(burst_times, 1), key=lambda x: x[1])

    wt = [0] * n
    tat = [0] * n
    for i in range(1, n):
        wt[i] = wt[i - 1] + processes[i - 1][1]
    for i in range(n):
        tat[i] = processes[i][1] + wt[i]

    for i in range(n):
        print(f"P{processes[i][0]}\t{processes[i][1]}\t{wt[i]}\t{tat[i]}")

    print(f"Avg Wait: {sum(wt)/n:.2f}, Avg TAT: {sum(tat)/n:.2f}")

sjf([6, 2, 8, 3, 4])
```

---

### 4. Priority Scheduling
```python
def priority_scheduling(burst_times, priorities):
    n = len(burst_times)
    processes = sorted(zip(range(1, n+1), burst_times, priorities), key=lambda x: x[2])

    wt = [0] * n
    tat = [0] * n
    for i in range(1, n):
        wt[i] = wt[i - 1] + processes[i - 1][1]
    for i in range(n):
        tat[i] = processes[i][1] + wt[i]
        print(f"P{processes[i][0]}\tPri:{processes[i][2]}\tWait:{wt[i]}\tTAT:{tat[i]}")

priority_scheduling([10, 1, 2, 1, 5], [3, 1, 4, 5, 2])
```

---

### 5. CPU Scheduling: Round Robin
```python
def round_robin(burst_times, quantum):
    n = len(burst_times)
    rem_bt = burst_times[:]
    wt = [0] * n
    tat = [0] * n
    t = 0

    while True:
        done = True
        for i in range(n):
            if rem_bt[i] > 0:
                done = False
                if rem_bt[i] > quantum:
                    t += quantum
                    rem_bt[i] -= quantum
                else:
                    t += rem_bt[i]
                    wt[i] = t - burst_times[i]
                    rem_bt[i] = 0
        if done:
            break

    for i in range(n):
        tat[i] = burst_times[i] + wt[i]
        print(f"P{i+1}\tWait:{wt[i]}\tTAT:{tat[i]}")

round_robin([10, 5, 8], quantum=2)
```

---

### 6. CPU Scheduling: HRRN (Highest Response Ratio Next)
```python
def hrrn(arrival_times, burst_times):
    n = len(burst_times)
    completed = [False] * n
    time = 0
    done = 0

    print("Process\tWait\tTAT")
    while done < n:
        best = -1
        best_ratio = -1
        for i in range(n):
            if arrival_times[i] <= time and not completed[i]:
                ratio = ((time - arrival_times[i]) + burst_times[i]) / burst_times[i]
                if ratio > best_ratio:
                    best_ratio = ratio
                    best = i
        if best != -1:
            wt = time - arrival_times[best]
            time += burst_times[best]
            tat = time - arrival_times[best]
            completed[best] = True
            done += 1
            print(f"P{best+1}\t{wt}\t{tat}")
        else:
            time += 1

hrrn([0, 2, 4, 6, 8], [3, 6, 4, 5, 2])
```

---

### 7 & 15. Banker's Algorithm (Deadlock Avoidance)
```python
def bankers_algorithm(alloc, max_res, avail):
    n = len(alloc)
    m = len(avail)
    need = [[max_res[i][j] - alloc[i][j] for j in range(m)] for i in range(n)]

    finished = [False] * n
    safe_seq = []

    while len(safe_seq) < n:
        found = False
        for i in range(n):
            if not finished[i] and all(need[i][j] <= avail[j] for j in range(m)):
                avail = [avail[j] + alloc[i][j] for j in range(m)]
                finished[i] = True
                safe_seq.append(i)
                found = True
        if not found:
            print("System is NOT in a safe state.")
            return

    print("Safe Sequence:", " -> ".join(f"P{p}" for p in safe_seq))

alloc = [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]]
max_res = [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]
avail = [3, 3, 2]
bankers_algorithm(alloc, max_res, avail)
```

---

### 8. Page Replacement: LRU
```python
def lru(pages, frames):
    frame = []
    faults = 0

    for page in pages:
        if page in frame:
            frame.remove(page)
            frame.append(page)
        else:
            if len(frame) == frames:
                frame.pop(0)
            frame.append(page)
            faults += 1

    print(f"Total LRU Page Faults: {faults}")

lru([7, 0, 1, 2, 0, 3, 0, 4], frames=3)
```

---

### 9. Page Replacement: FIFO
```python
def fifo(pages, frames):
    frame = []
    faults = 0

    for page in pages:
        if page not in frame:
            if len(frame) == frames:
                frame.pop(0)
            frame.append(page)
            faults += 1

    print(f"Total FIFO Page Faults: {faults}")

fifo([1, 3, 0, 3, 5, 6, 3], frames=3)
```

---

### 10. Page Replacement: Optimal
```python
def optimal(pages, frames):
    frame = []
    faults = 0

    for i, page in enumerate(pages):
        if page in frame:
            continue
        if len(frame) < frames:
            frame.append(page)
            faults += 1
        else:
            future = []
            for f in frame:
                try:
                    future.append(pages[i+1:].index(f))
                except ValueError:
                    future.append(float('inf'))
            frame[future.index(max(future))] = page
            faults += 1

    print(f"Total Optimal Page Faults: {faults}")

optimal([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], frames=4)
```

---

### 11. Memory Management: First Fit
```python
def first_fit(block_sizes, process_sizes):
    allocation = [-1] * len(process_sizes)
    blocks = block_sizes[:]

    for i, size in enumerate(process_sizes):
        for j, block in enumerate(blocks):
            if block >= size:
                allocation[i] = j
                blocks[j] -= size
                break

    print("Process\tSize\tBlock")
    for i, size in enumerate(process_sizes):
        block = f"{allocation[i]+1}" if allocation[i] != -1 else "Not Allocated"
        print(f"{i+1}\t{size}\t{block}")

first_fit([100, 500, 200, 300, 600], [212, 417, 112, 426])
```

---

### 12. Memory Management: Best Fit
```python
def best_fit(block_sizes, process_sizes):
    allocation = [-1] * len(process_sizes)
    blocks = block_sizes[:]

    for i, size in enumerate(process_sizes):
        best_idx = -1
        for j, block in enumerate(blocks):
            if block >= size:
                if best_idx == -1 or blocks[j] < blocks[best_idx]:
                    best_idx = j
        if best_idx != -1:
            allocation[i] = best_idx
            blocks[best_idx] -= size

    print("Process\tSize\tBlock")
    for i, size in enumerate(process_sizes):
        block = f"{allocation[i]+1}" if allocation[i] != -1 else "Not Allocated"
        print(f"{i+1}\t{size}\t{block}")

best_fit([100, 500, 200, 300, 600], [212, 417, 112, 426])
```

---

### 13. Memory Management: Worst Fit
```python
def worst_fit(block_sizes, process_sizes):
    allocation = [-1] * len(process_sizes)
    blocks = block_sizes[:]

    for i, size in enumerate(process_sizes):
        worst_idx = -1
        for j, block in enumerate(blocks):
            if block >= size:
                if worst_idx == -1 or blocks[j] > blocks[worst_idx]:
                    worst_idx = j
        if worst_idx != -1:
            allocation[i] = worst_idx
            blocks[worst_idx] -= size

    print("Process\tSize\tBlock")
    for i, size in enumerate(process_sizes):
        block = f"{allocation[i]+1}" if allocation[i] != -1 else "Not Allocated"
        print(f"{i+1}\t{size}\t{block}")

worst_fit([100, 500, 200, 300, 600], [212, 417, 112, 426])
```

---

### 14. Reader-Writer Problem using Semaphores
*Note: This demonstrates the Reader-Writer synchronization logic using threading and semaphores.*
```python
import threading

mutex = threading.Semaphore(1)
wrt = threading.Semaphore(1)
read_count = 0
shared_data = [1]

def writer(wno):
    wrt.acquire()
    shared_data[0] *= 2
    print(f"Writer {wno} modified data to {shared_data[0]}")
    wrt.release()

def reader(rno):
    global read_count
    mutex.acquire()
    read_count += 1
    if read_count == 1:
        wrt.acquire()
    mutex.release()

    print(f"Reader {rno} reads data as {shared_data[0]}")

    mutex.acquire()
    read_count -= 1
    if read_count == 0:
        wrt.release()
    mutex.release()

print("Reader-Writer Logic Simulation")
print("-" * 30)
threads = [
    threading.Thread(target=reader, args=(1,)),
    threading.Thread(target=writer, args=(1,)),
    threading.Thread(target=reader, args=(2,)),
    threading.Thread(target=writer, args=(2,)),
]
for t in threads:
    t.start()
for t in threads:
    t.join()
```
